import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";


interface IProps {
    pageSize: number;
    totalPage: number;
    pageNumber: number;
    totalCount: number;
    rowsPerPageOptions: number[];
    onChangePage?: (value: any) => void;
};

const CustomPagination = (props: IProps) => {
    return (
        <Stack spacing={2}>
            <Pagination
                showLastButton
                showFirstButton
                color={"primary"}
                count={props.totalPage}
                page={props.pageNumber}
                // siblingCount={1}
                // boundaryCount={1}
                onChange={(event, page) => {
                    props.onChangePage(page);
                }}
            />
        </Stack>
    );
};

export default CustomPagination;