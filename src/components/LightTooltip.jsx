import { Tooltip, tooltipClasses, styled,  } from '@mui/material';

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} placement="top" classes={{ popper: className }} arrow />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'white',
      color: 'black',
      boxShadow: theme.shadows[1],
      fontSize: 12,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: 'white',
    },
}));

export default LightTooltip;
