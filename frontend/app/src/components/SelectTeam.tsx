import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent, selectClasses } from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import GroupWorkRoundedIcon from '@mui/icons-material/GroupWorkRounded';
import { useView } from '../ context/ViewContext.tsx';
import type {} from '@mui/material/themeCssVarsAugmentation';


const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectTeam() {
  const { teams, setSelectedTeam, selectedTeam } = useView();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selected = teams.find((team) => team.id === event.target.value);
    if (selected) {
      setSelectedTeam(selected);
    }
  };

  return (
    <Select
      labelId="team-select"
      id="team-simple-select"
      value={selectedTeam?.id || ''}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Select team' }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: 215,
        '&.MuiList-root': {
          p: '8px',
        },
        [`& .${selectClasses.select}`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          pl: 1,
        },
      }}
    >
      {teams.length === 0 || !selectedTeam ? (
        <MenuItem disabled>
          <ListItemText primary="No teams available" />
        </MenuItem>
      ) : (
        teams.map((team) => (

          <MenuItem key={team.id} value={team.id}>
            <ListItemAvatar>
              <Avatar alt={team.name}>
                <GroupWorkRoundedIcon sx={{ fontSize: '1rem' }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={String(team.name).charAt(0).toUpperCase() + String(team.name).slice(1)} />
          </MenuItem>
        ))
      )}
    </Select>
  );
}
