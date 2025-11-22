import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { IReduxState } from '../../../app/types';
import { IconUser } from '../../icons/svg';
import { getParticipantById } from '../../participants/functions';
import { IParticipant } from '../../participants/types';
import { getAvatarColor, getInitials, isCORSAvatarURL } from '../functions';
import { IAvatarProps as AbstractProps } from '../types';
import { StatelessAvatar } from './';

export interface IProps {
    _corsAvatarURLs?: Array<string>;
    _customAvatarBackgrounds?: Array<string>;
    _initialsBase?: string;
    _loadableAvatarUrl?: string;
    _loadableAvatarUrlUseCORS?: boolean;
    className?: string;
    colorBase?: string;
    defaultIcon?: string;
    displayName?: string;
    dynamicColor?: boolean;
    id?: string;
    participantId?: string;
    size?: number;
    status?: string;
    testId?: string;
    url?: string;
    useCORS?: boolean;
}

interface IState {
    avatarFailed: boolean;
    isUsingCORS: boolean;
}

export const DEFAULT_SIZE = 65;

class Avatar<P extends IProps> extends PureComponent<P, IState> {
    static defaultProps = {
        defaultIcon: IconUser,
        dynamicColor: true
    };

    constructor(props: P) {
        super(props);

        const { _corsAvatarURLs, url, useCORS } = props;

        this.state = {
            avatarFailed: false,
            isUsingCORS:
                Boolean(url && url.endsWith('.svg'))   // 🔥 SVG avatars avoid CORS logic
                    ? false
                    : Boolean(useCORS) || Boolean(url && isCORSAvatarURL(url, _corsAvatarURLs))
        };

        this._onAvatarLoadError = this._onAvatarLoadError.bind(this);
    }

    override componentDidUpdate(prevProps: P) {
        const { _corsAvatarURLs, url } = this.props;

        if (prevProps.url !== url) {
            this.setState({
                avatarFailed: false,

                // 🔥 disable CORS retries for SVG avatars
                isUsingCORS:
                    url && url.endsWith('.svg')
                        ? false
                        : Boolean(this.props.useCORS) ||
                          Boolean(url && isCORSAvatarURL(url, _corsAvatarURLs))
            });
        }
    }

    override render() {
        const {
            _customAvatarBackgrounds,
            _initialsBase,
            _loadableAvatarUrl,
            _loadableAvatarUrlUseCORS,
            className,
            colorBase,
            defaultIcon,
            dynamicColor,
            id,
            size,
            status,
            testId,
            url
        } = this.props;

        const { avatarFailed, isUsingCORS } = this.state;

        const avatarProps: AbstractProps & {
            className?: string;
            iconUser?: any;
            id?: string;
            status?: string;
            testId?: string;
            url?: string;
            useCORS?: boolean;
        } = {
            className,
            color: undefined,
            id,
            initials: undefined,
            onAvatarLoadError: undefined,
            onAvatarLoadErrorParams: undefined,
            size,
            status,
            testId,
            url: undefined,
            useCORS: isUsingCORS
        };

        const useReduxLoadableAvatarURL = avatarFailed || !url;
        const effectiveURL = useReduxLoadableAvatarURL ? _loadableAvatarUrl : url;

        if (effectiveURL) {
            avatarProps.onAvatarLoadError = this._onAvatarLoadError;

            if (useReduxLoadableAvatarURL) {
                avatarProps.onAvatarLoadErrorParams = { dontRetry: true };
                avatarProps.useCORS = _loadableAvatarUrlUseCORS;
            }

            avatarProps.url = effectiveURL;
        }

        const initials = getInitials(_initialsBase);

        if (initials) {
            if (dynamicColor) {
                avatarProps.color = getAvatarColor(
                    colorBase || _initialsBase,
                    _customAvatarBackgrounds ?? []
                );
            }

            avatarProps.initials = initials;
        }

        if (navigator.product !== 'ReactNative') {
            avatarProps.iconUser = defaultIcon;
        }

        return <StatelessAvatar {...avatarProps} />;
    }

    /**
     * Handle LOAD ERROR — patched for SVG
     */
    _onAvatarLoadError(params: { dontRetry?: boolean } = {}) {
        const { dontRetry = false } = params;

        const avatarURL = this.props.url || '';

        // 🔥🔥 SVG PATCH: allow SVG even if browser reports an error
        if (avatarURL.endsWith('.svg')) {
            console.warn('Ignoring SVG avatar load error:', avatarURL);
            return; // treat as success
        }

        // Original logic unchanged for PNG/JPG
        if (Boolean(this.props.useCORS) === this.state.isUsingCORS && !dontRetry) {
            this.setState({
                isUsingCORS: !this.state.isUsingCORS
            });
        } else {
            this.setState({
                avatarFailed: true
            });
        }
    }
}

export function _mapStateToProps(state: IReduxState, ownProps: IProps) {
    const { colorBase, displayName, participantId } = ownProps;
    const _participant: IParticipant | undefined = participantId
        ? getParticipantById(state, participantId)
        : undefined;

    const _initialsBase = _participant?.name ?? displayName;
    const { corsAvatarURLs } = state['features/base/config'];

    return {
        _customAvatarBackgrounds: state['features/dynamic-branding'].avatarBackgrounds,
        _corsAvatarURLs: corsAvatarURLs,
        _initialsBase,
        _loadableAvatarUrl: _participant?.loadableAvatarUrl,
        _loadableAvatarUrlUseCORS: _participant?.loadableAvatarUrlUseCORS,
        colorBase
    };
}

export default connect(_mapStateToProps)(Avatar);
