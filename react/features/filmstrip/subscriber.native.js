// @flow

import { StateListenerRegistry } from '../base/redux';
import { shouldDisplayTileView } from '../video-layout';

import { setRemoteParticipants, setTileViewDimensions } from './actions';
import { getTileViewParticipantCount } from './functions.native';
import './subscriber.any';

/**
 * Listens for changes in the number of participants to calculate the dimensions of the tile view grid and the tiles.
 */
StateListenerRegistry.register(
    /* selector */ state => getTileViewParticipantCount(state),
    /* listener */ (_, store) => {
        const state = store.getState();

        if (shouldDisplayTileView(state)) {
            store.dispatch(setTileViewDimensions());
        }
    });

/**
 * Listens for changes in the selected layout to calculate the dimensions of the tile view grid and horizontal view.
 */
StateListenerRegistry.register(
    /* selector */ state => shouldDisplayTileView(state),
    /* listener */ (isTileView, store) => {
        if (isTileView) {
            store.dispatch(setTileViewDimensions());
        }
    });

/**
 * Listens for changes in the current conference and clears remote participants from this feature.
 */
StateListenerRegistry.register(
    state => state['features/base/conference'].conference,
    (conference, { dispatch }, previousConference) => {
        if (conference !== previousConference) {
            dispatch(setRemoteParticipants([]));
        }
    });
