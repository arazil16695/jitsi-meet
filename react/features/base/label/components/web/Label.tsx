import { Theme } from '@mui/material';
import React from 'react';
import { makeStyles } from 'tss-react/mui';

import Icon from '../../../icons/components/Icon';
import { withPixelLineHeight } from '../../../styles/functions.web';
import { COLORS } from '../../constants';

interface Props {

    /**
     * Own CSS class name.
     */
    className?: string;

    /**
     * The color of the label.
     */
    color?: string;

    /**
     * An SVG icon to be rendered as the content of the label.
     */
    icon?: Function;

    /**
     * Color for the icon.
     */
    iconColor?: string;

    /**
     * HTML ID attribute to add to the root of {@code Label}.
     */
    id?: string;

    /**
     * Click handler if any.
     */
    onClick?: (e?: React.MouseEvent) => void;

    /**
     * String or component that will be rendered as the label itself.
     */
    text?: string;

}

const useStyles = makeStyles()((theme: Theme) => {
    return {
        label: {
            ...withPixelLineHeight(theme.typography.labelRegular),
            alignItems: 'center',
            background: theme.palette.ui04,
            borderRadius: Number(theme.shape.borderRadius) / 2,
            color: theme.palette.text01,
            display: 'flex',
            height: 28,
            margin: '0 0 4px 4px',
            padding: '0 8px'
        },
        withIcon: {
            marginLeft: 8
        },
        clickable: {
            cursor: 'pointer'
        },
        [COLORS.white]: {
            background: theme.palette.text01,
            color: theme.palette.ui04,

            '& svg': {
                fill: theme.palette.ui04
            }
        },
        [COLORS.green]: {
            background: theme.palette.success02
        },
        [COLORS.red]: {
            background: theme.palette.actionDanger
        }
    };
});

const Label = ({
    className,
    color,
    icon,
    iconColor,
    id,
    onClick,
    text
}: Props) => {
    const { classes, cx } = useStyles();

    return (
        <div
            className = { cx(classes.label, onClick && classes.clickable,
                color && classes[color], className
            ) }
            id = { id }
            onClick = { onClick }>
            {icon && <Icon
                color = { iconColor }
                size = '16'
                src = { icon } />}
            {text && <span className = { icon && classes.withIcon }>{text}</span>}
        </div>
    );
};

export default Label;
