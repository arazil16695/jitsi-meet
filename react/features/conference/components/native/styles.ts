import BaseTheme from '../../../base/ui/components/BaseTheme.native';
 
export const INSECURE_ROOM_NAME_LABEL_COLOR = BaseTheme.palette.actionDanger;
 
const TITLE_BAR_BUTTON_SIZE = 24;
 
const titleBarSafeView = {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
};
 
const alwaysOnTitleBar = {
    alignItems: 'center',  // Correct type for alignItems
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    borderRadius: BaseTheme.shape.borderRadius,
    flexDirection: 'row',  // Correct type for flexDirection
    justifyContent: 'center',  // Correct type for justifyContent
    marginTop: BaseTheme.spacing[3],
    paddingRight: BaseTheme.spacing[0],
    '&:not(:empty)': {
        padding: BaseTheme.spacing[1]
    }
};
 
export default {
    conference: {
        alignSelf: 'stretch',
        backgroundColor: BaseTheme.palette.uiBackground,
        flex: 1
    },
    displayNameContainer: {
        margin: BaseTheme.spacing[3]
    },
    indicatorContainer: {
        flex: 1,
        flexDirection: 'row'  // Correct type for flexDirection
    },
    titleBarButtonContainer: {
        borderRadius: 3,
        height: BaseTheme.spacing[7],
        marginTop: BaseTheme.spacing[1],
        marginRight: BaseTheme.spacing[1],
        zIndex: 1,
        width: BaseTheme.spacing[7]
    },
    titleBarButton: {
        iconStyle: {
            color: BaseTheme.palette.icon01,
            padding: 12,
            fontSize: TITLE_BAR_BUTTON_SIZE
        },
        underlayColor: 'transparent'
    },
    lonelyMeetingContainer: {
        alignSelf: 'stretch',
        alignItems: 'center',  // Correct type for alignItems
        padding: BaseTheme.spacing[3]
    },
    lonelyMessage: {
        color: BaseTheme.palette.text01,
        paddingVertical: BaseTheme.spacing[2]
    },
    pipButtonContainer: {
        borderRadius: 3,
        height: BaseTheme.spacing[7],
        marginTop: BaseTheme.spacing[1],
        marginLeft: BaseTheme.spacing[1],  // Placed on the left
        zIndex: 1,
        width: BaseTheme.spacing[7]
    },
    pipButton: {
        iconStyle: {
            color: BaseTheme.palette.icon01,
            padding: 12,
            fontSize: TITLE_BAR_BUTTON_SIZE
        },
        underlayColor: 'transparent'
    },
    titleBarSafeViewColor: {
        ...titleBarSafeView,
        backgroundColor: '#00000000'
    },
    titleBarSafeViewTransparent: {
        ...titleBarSafeView
    },
    titleBarWrapper: {
        alignItems: 'center',  // Correct type for alignItems
        flex: 1,
        flexDirection: 'row',  // Correct type for flexDirection
        height: BaseTheme.spacing[8],
        justifyContent: 'space-between',  // Correct type for justifyContent
        paddingHorizontal: BaseTheme.spacing[2]
    },
    alwaysOnTitleBar: {
        ...alwaysOnTitleBar,
        marginRight: BaseTheme.spacing[2]
    },
    alwaysOnTitleBarWide: {
        ...alwaysOnTitleBar,
        marginRight: BaseTheme.spacing[12]
    },
    expandedLabelWrapper: {
        zIndex: 1
    },
    roomTimer: {
        ...BaseTheme.typography.bodyShortBold,
        color: BaseTheme.palette.text01,
        lineHeight: 14,
        textAlign: 'center'
    },
    roomTimerView: {
        backgroundColor: BaseTheme.palette.ui03,
        borderRadius: BaseTheme.shape.borderRadius,
        height: 32,
        justifyContent: 'center',
        paddingHorizontal: BaseTheme.spacing[2],
        paddingVertical: BaseTheme.spacing[1],
        minWidth: 50
    },
    roomName: {
        color: BaseTheme.palette.text01,
        ...BaseTheme.typography.bodyShortBold,
        paddingVertical: 6
    },
    roomNameView: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderBottomLeftRadius: 3,
        borderTopLeftRadius: 3,
        flexShrink: 1,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    roomNameWrapper: {
        flexDirection: 'row',  // Correct type for flexDirection
        marginRight: 10,
        marginLeft: 8,
        flexShrink: 1,
        flexGrow: 1
    },
    toolboxAndFilmstripContainer: {
        bottom: 0,
        flexDirection: 'column',  // Correct type for flexDirection
        justifyContent: 'flex-end',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },
    insecureRoomNameLabel: {
        backgroundColor: INSECURE_ROOM_NAME_LABEL_COLOR,
        borderRadius: BaseTheme.shape.borderRadius,
        height: 32
    },
    raisedHandsCountLabel: {
        alignItems: 'center',  // Correct type for alignItems
        backgroundColor: BaseTheme.palette.warning02,
        borderRadius: BaseTheme.shape.borderRadius,
        flexDirection: 'row',  // Correct type for flexDirection
        marginBottom: BaseTheme.spacing[0],
        marginLeft: BaseTheme.spacing[0]
    },
    raisedHandsCountLabelText: {
        color: BaseTheme.palette.uiBackground,
        paddingLeft: BaseTheme.spacing[2]
    },
 
    // New container for right-aligned buttons
    rightButtonsContainer: {
        flexDirection: 'row',  // Correct type for flexDirection
        justifyContent: 'flex-end',  // Correct type for justifyContent
        alignItems: 'center',        // Correct type for alignItems
    }
};
 
 