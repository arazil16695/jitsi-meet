import React, { PureComponent } from 'react';
import {
  FlatList,
  GestureResponderEvent,
  SafeAreaView,
  TouchableWithoutFeedback,
  ViewToken
} from 'react-native';
import { EdgeInsets, withSafeAreaInsets } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { IReduxState, IStore } from '../../../app/types';
import { getLocalParticipant, getParticipantCountWithFake } from '../../../base/participants/functions';
import { ILocalParticipant } from '../../../base/participants/types';
import { getHideSelfView } from '../../../base/settings/functions.any';
import { setVisibleRemoteParticipants } from '../../actions.web';

import Thumbnail from './Thumbnail';
import styles from './styles';

interface IProps {
  _aspectRatio: Symbol;
  _columns: number;               // (kept but not used)
  _disableSelfView: boolean;
  _height: number;
  _localParticipant?: ILocalParticipant;
  _participantCount: number;
  _remoteParticipants: Array<string>;
  _thumbnailHeight?: number;      // (kept but not used)
  _width: number;
  dispatch: IStore['dispatch'];
  insets: EdgeInsets;
  onClick: (e?: GestureResponderEvent) => void;
}

const EMPTY_ARRAY: any[] = [];

class TileView extends PureComponent<IProps> {
  _contentContainerStyles: any;
  _flatListStyles: any;
  _viewabilityConfig: Object;

  constructor(props: IProps) {
    super(props);

    this._keyExtractor = this._keyExtractor.bind(this);
    this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this);

    this._viewabilityConfig = {
      itemVisiblePercentThreshold: 30,
      minimumViewTime: 500
    };
    this._flatListStyles = { ...styles.flatListTileView };
    this._contentContainerStyles = {
      ...styles.contentContainer,
      paddingBottom: this.props.insets?.bottom || 0
    };
  }

  _keyExtractor(item: string) {
    return item;
  }

  _onViewableItemsChanged({ viewableItems = [] }: { viewableItems: ViewToken[] }) {
    const { _disableSelfView } = this.props;

    if (viewableItems[0]?.index === 0 && !_disableSelfView) {
      viewableItems.shift();
    }
    if (viewableItems.length === 0) {
      return;
    }

    const startIndex = Number(viewableItems[0].index) - (_disableSelfView ? 0 : 1);
    const endIndex = Number(viewableItems[viewableItems.length - 1].index) - (_disableSelfView ? 0 : 1);

    this.props.dispatch(setVisibleRemoteParticipants(startIndex, endIndex));
  }

  _getSortedParticipants() {
    const { _localParticipant, _remoteParticipants, _disableSelfView } = this.props;

    if (!_localParticipant) {
      return EMPTY_ARRAY;
    }
    if (_disableSelfView) {
      return _remoteParticipants;
    }
    return [ _localParticipant?.id, ..._remoteParticipants ];
  }

  override render() {
    const { _participantCount, _width, _height, onClick } = this.props;
    const participants = this._getSortedParticipants();
    if (!participants.length) return null;

    // ---- GRID RULES (up to 10, with sensible fallback) ----
let columns = 1;
let rows = 1;

if (_participantCount <= 1) {
  columns = 1; rows = 1;
} else if (_participantCount === 2) {
  columns = 2; rows = 1;
} else if (_participantCount <= 4) {
  columns = 2; rows = 2;
} else if (_participantCount <= 6) {
  columns = 3; rows = 2;
} else if (_participantCount <= 9) {
  columns = 3; rows = 3;
} else if (_participantCount <= 12) {
  columns = 3; rows = 4;
} else if (_participantCount <= 15) {
  columns = 3; rows = 5;
} else if (_participantCount <= 16) {
  columns = 4; rows = 4;
} else {
  // fallback >20: still 4×5 (shows first 20 neatly)
  columns = 4; rows = 5;
}

const tileWidth = _width / columns;
const tileHeight = _height / rows;

    // ensure container styles track size
    if (this._flatListStyles.minHeight !== _height || this._flatListStyles.minWidth !== _width) {
      this._flatListStyles = { ...styles.flatListTileView, minHeight: _height, minWidth: _width };
    }
    if (this._contentContainerStyles.minHeight !== _height || this._contentContainerStyles.minWidth !== _width) {
      this._contentContainerStyles = {
        ...styles.contentContainer,
        minHeight: _height,
        minWidth: _width,
        paddingBottom: this.props.insets?.bottom || 0
      };
    }

    // renderItem closes over computed tile sizes so FlatList and items agree
    const renderItem = ({ item }: { item: string }) => (
      <Thumbnail
        key={item}
        participantID={item}
        tileView={true}
        renderDisplayName={true}
        width={tileWidth}
        height={tileHeight}
      />
    );

    return (
      <TouchableWithoutFeedback onPress={onClick}>
        <SafeAreaView style={styles.flatListContainer}>
          <FlatList
            bounces={false}
            contentContainerStyle={this._contentContainerStyles}
            data={participants}
            horizontal={false}
            // keep enough rows warm; each row has height tileHeight
            initialNumToRender={Math.max(4, rows * columns)}
            key={`cols-${columns}`}                // force relayout when grid changes
            keyExtractor={this._keyExtractor}
            numColumns={columns}                   // <<< use our computed columns
            onViewableItemsChanged={this._onViewableItemsChanged}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={this._flatListStyles}
            viewabilityConfig={this._viewabilityConfig}
            windowSize={3}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

function _mapStateToProps(state: IReduxState, ownProps: any) {
  const responsiveUi = state['features/base/responsive-ui'];
  const { remoteParticipants } = state['features/filmstrip'];
  const disableSelfView = getHideSelfView(state);

  return {
    _aspectRatio: responsiveUi.aspectRatio,
    _columns: 1, // not used; grid is computed in render()
    _disableSelfView: disableSelfView,
    _height: responsiveUi.clientHeight - (ownProps.insets?.top || 0),
    _insets: ownProps.insets,
    _localParticipant: getLocalParticipant(state),
    _participantCount: getParticipantCountWithFake(state),
    _remoteParticipants: remoteParticipants,
    _thumbnailHeight: undefined,
    _width: responsiveUi.clientWidth - (ownProps.insets?.right || 0) - (ownProps.insets?.left || 0)
  };
}

export default withSafeAreaInsets(connect(_mapStateToProps)(TileView));
