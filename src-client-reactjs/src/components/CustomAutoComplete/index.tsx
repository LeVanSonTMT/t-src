import * as React from "react";
import Popper from "@mui/material/Popper";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useTheme, styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import { ListSubheader, Autocomplete as MUIAutocomplete, TextField, Typography } from "@mui/material";

import Helpers from "commons/helpers";
import { ICodename } from "commons/interfaces";



const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
	const { data, index, style } = props;

	const dataSet = data[index];

	const inlineStyle = {
		...style,
		top: (style.top as number) + LISTBOX_PADDING,
	};

	if (dataSet.hasOwnProperty("group")) {
		return (
			<ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
				{dataSet.group}
			</ListSubheader>
		);
	}

	const { key, ...optionProps } = dataSet[0];

	return (
		<Typography
			key={key}
			variant={"button"}
			component={"li"}
			{...optionProps}
			noWrap
			style={inlineStyle}
		>
			{dataSet[1]}
		</Typography>
	);
};

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
	const outerProps = React.useContext(OuterElementContext);
	return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
	const ref = React.useRef<VariableSizeList>(null);
	React.useEffect(() => {
		if (ref.current != null) {
			ref.current.resetAfterIndex(0, true);
		}
	}, [data]);
	return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(function ListboxComponent(props, ref) {
	const { children, ...other } = props;
	const itemData: React.ReactElement<unknown>[] = [];
	(children as React.ReactElement<unknown>[]).forEach(
		(
			item: React.ReactElement<unknown> & {
				children?: React.ReactElement<unknown>[];
			},
		) => {
			itemData.push(item);
			itemData.push(...(item.children || []));
		},
	);

	const theme = useTheme();
	const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
	const itemSize = smUp ? 36 : 48;
	const itemCount = itemData.length;

	const getChildSize = (child: React.ReactElement<unknown>) => {
		if (child.hasOwnProperty("group")) {
			return 48;
		}
		return itemSize;
	};

	const getHeight = () => {
		if (itemCount > 8) {
			return 8 * itemSize;
		}
		return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
	};

	const gridRef = useResetCache(itemCount);

	return (
		<div ref={ref}>
			<OuterElementContext.Provider value={other}>
				<VariableSizeList
					ref={gridRef}
					width={"100%"}
					itemData={itemData}
					itemCount={itemCount}
					innerElementType={"ul"}
					outerElementType={OuterElementType}
					height={getHeight() + 2 * LISTBOX_PADDING}
					itemSize={(index: any) => getChildSize(itemData[index])}
					overscanCount={5}
				>
					{renderRow}
				</VariableSizeList>
			</OuterElementContext.Provider>
		</div>
	);
});

const StyledPopper = styled(Popper)({
	[`& .${autocompleteClasses.listbox}`]: {
		boxSizing: "border-box",
		"& ul": {
			padding: 0,
			margin: 0,
		},
	},
});

const CustomAutoComplete = ({
	data,
	label,
	variant,
	disabled,
	required,
	multiple,
	placeholder,
	defaultValue,
	errorMessage,
	optionDisabled,
	renderOption,
	onChangeValue,
	onChangeOption,
}: {
	label?: string;
	required?: boolean;
	multiple?: boolean;
	disabled?: boolean;
	placeholder?: string;
	variant?: "standard" | "outlined";

	data: ICodename[];
	defaultValue?: any;
	errorMessage?: string;
	optionDisabled?: string[];
	onChangeValue?: (value: any) => void;
	onChangeOption?: (value: any) => void;
	renderOption?: (props: any, value: any, state: any) => React.ReactNode;
}) => {

	const formatValue = (newValue: any) => {
		if (data.length > 0) {
			if (multiple) {
				if ([...newValue || []].length > 0) {
					const selectedOption: ICodename[] = [];
					newValue.forEach((val: any) => {
						const temp = data.find((el) => `${el.code}` === `${val}`);
						!Helpers.isNullOrEmpty(temp) && selectedOption.push(temp);
					});
					return selectedOption;
				} else {
					return [];
				}
			} else {
				const selectedOption = data.find((el) => `${el.code}` === `${newValue}`);
				return !Helpers.isNullOrEmpty(selectedOption) ? selectedOption : null;
			}
		} else {
			return multiple ? [] : null;
		}
	};

	const getPlaceholder = () => {
		if (multiple) {
			return [...defaultValue || []].length > 0 ? "" : placeholder;
		} else {
			return Helpers.isNullOrEmpty(defaultValue) ? placeholder : "";
		}
	};

	const handleOnChange = (selectedOption: any) => {
		if (multiple) {
			let result: string[] = [];
			for (let items of selectedOption) {
				result.push(items.code);
			}
			onChangeValue && onChangeValue(result);
		} else {
			const v = selectedOption ? selectedOption?.code : null;
			onChangeValue && onChangeValue(v);
		}
		onChangeOption && onChangeOption(selectedOption);
	};

	return (
		<MUIAutocomplete
			fullWidth
			disableListWrap
			multiple={multiple}
			disabled={disabled}
			key={(defaultValue as any) || (data.toString() as any)}
			isOptionEqualToValue={(option, value) => {
				const v = (Array.isArray(value) ? value[0] : value)?.code;
				const o = (Array.isArray(option) ? option[0] : option)?.code;
				return v === o;
			}}

			options={[...data || []]}
			value={formatValue(defaultValue)}
			renderInput={(params) => (
				<TextField
					{...params}
					fullWidth
					label={label}
					size={"small"}
					variant={variant}
					disabled={disabled}
					required={required}
					helperText={errorMessage}
					placeholder={getPlaceholder()}
					error={!Helpers.isNullOrEmpty(errorMessage)}
					slotProps={{ inputLabel: { shrink: true } }}
				/>
			)}
			renderOption={renderOption
				? renderOption
				: (props, option, state) => {
					const o = (Array.isArray(option) ? option?.[0] : option);
					return ([props, o?.name, state.index] as React.ReactNode);
				}
			}

			slots={{ popper: StyledPopper }}
			slotProps={{
				listbox: {
					component: ListboxComponent,
				},
			}}

			getOptionLabel={(option: any) => {
				const o = ((Array.isArray(option)) ? option?.[0] : option);
				return o?.name || "";
			}}
			getOptionDisabled={(option: any) => {
				const o = ((Array.isArray(option)) ? option?.[0] : option);
				return [...optionDisabled || []].indexOf(`${o?.code}`) !== -1;
			}}
			onChange={(event: any, selectedOption: any) => {
				handleOnChange(selectedOption);
			}}
		/>
	);
};

export default CustomAutoComplete;
