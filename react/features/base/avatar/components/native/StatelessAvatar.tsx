import React, { Component } from 'react';
import { Image, Text, TextStyle, View, ViewStyle } from 'react-native';
import { SvgUri } from 'react-native-svg';

import Icon from '../../../icons/components/Icon';
import { StyleType } from '../../../styles/functions.native';
import { isIcon } from '../../functions';
import { IAvatarProps } from '../../types';

import styles from './styles';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const DEFAULT_AVATAR = require('../../../../../../images/avatar.png');

interface IProps extends IAvatarProps {
    status?: string;
    style?: StyleType;
    url?: string;
}

export default class StatelessAvatar extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
        this._onAvatarLoadError = this._onAvatarLoadError.bind(this);
    }

    override render() {
        const { initials, size, style, url } = this.props;

        let avatar;

        if (isIcon(url)) {
            avatar = this._renderIconAvatar(url);
        } else if (url) {
            avatar = this._renderURLAvatar();
        } else if (initials) {
            avatar = this._renderInitialsAvatar();
        } else {
            avatar = this._renderDefaultAvatar();
        }

        return (
            <View>
                <View style={[styles.avatarContainer(size) as ViewStyle, style]}>
                    {avatar}
                </View>
                {this._renderAvatarStatus()}
            </View>
        );
    }

    _renderAvatarStatus() {
        const { size, status } = this.props;

        if (!status) {
            return null;
        }

        return (
            <View style={styles.badgeContainer}>
                <View style={styles.badge(size, status) as ViewStyle} />
            </View>
        );
    }

    _renderDefaultAvatar() {
        const { size } = this.props;

        return (
            <Image
                source={DEFAULT_AVATAR}
                style={[styles.avatarContent(size), styles.staticAvatar]}
            />
        );
    }

    _renderIconAvatar(icon: Function) {
        const { color, size } = this.props;

        return (
            <View
                style={[
                    styles.initialsContainer as ViewStyle,
                    { backgroundColor: color }
                ]}>
                <Icon src={icon} style={styles.initialsText(size)} />
            </View>
        );
    }

    _renderInitialsAvatar() {
        const { color, initials, size } = this.props;

        return (
            <View
                style={[
                    styles.initialsContainer as ViewStyle,
                    { backgroundColor: color }
                ]}>
                <Text style={styles.initialsText(size) as TextStyle}>{initials}</Text>
            </View>
        );
    }
    /**
     * 🔥 UPDATED: support SVG on React-Native
     */
    _renderURLAvatar() {
    const { size, url } = this.props;
    // 🔵 SVG support for React-Native
    if (url && url.endsWith('.svg')) {
        return (
            <SvgUri
                width={size}
                height={size}
                uri={url}
            />
        );
    }
    // 🟩 PNG/JPG/WebP fallback
    return (
        <Image
            defaultSource={DEFAULT_AVATAR}
            onError={() => this._onAvatarLoadError()}
            resizeMode='cover'
            source={{ uri: url }}
            style={styles.avatarContent(size)}
        />
    );
}
    _onAvatarLoadError() {
        const { onAvatarLoadError, onAvatarLoadErrorParams = {} } = this.props;

        if (onAvatarLoadError) {
            onAvatarLoadError({
                ...onAvatarLoadErrorParams,
                dontRetry: true
            });
        }
    }
}
