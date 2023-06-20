import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function SortSelect({ sort, setSort }: { sort: string; setSort: React.Dispatch<React.SetStateAction<string>> }) {
  const handleChange = (event: SelectChangeEvent) => {
    setSort(event.target.value);
  };
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: '100px', ml: '12px', mr: 'auto' }}>
      <InputLabel id="sort" sx={{ lineHeight: '1' }}>
        Sort
      </InputLabel>
      <Select
        id="sort"
        value={sort}
        label="sort"
        onChange={handleChange}
        sx={{ height: '35px', fontSize: '12px', color: 'hsl(169, 79%, 48%)' }}
      >
        <MenuItem value="createdAt" sx={{ fontSize: '12px' }}>
          Time
        </MenuItem>
        <MenuItem value="upvoteCount" sx={{ fontSize: '12px' }}>
          Upvotes
        </MenuItem>
        <MenuItem value="downvoteCount" sx={{ fontSize: '12px' }}>
          Downvotes
        </MenuItem>
      </Select>
    </FormControl>
  );
}
export default SortSelect;
