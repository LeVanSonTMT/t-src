import Stack from "@mui/material/Stack";
import Avatar, { AvatarProps } from "@mui/material/Avatar";

import Helpers from "commons/helpers";

function stringToColor(string: string) {
    let i;
    let hash = 0;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
};

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: Helpers.getCharacterAvatar(name),
        //  `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
};

interface Props extends AvatarProps {
    text?: string;
    // [key: string]: any;
};

const CustomAvatar = (props: Props) => {
    const { text, ...rest } = props;
    const newText = Helpers.isNullOrEmpty(text) ? "" : text.toUpperCase();

    return (
        <Stack direction="row" spacing={2}>
            <Avatar
                {...rest}
                {...!Helpers.isNullOrEmpty(newText) && stringAvatar(newText)}
            />
        </Stack>
    );
};

export default CustomAvatar;
