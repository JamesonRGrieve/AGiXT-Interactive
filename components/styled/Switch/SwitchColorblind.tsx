'use client';
import { ThemeState, ThemeContext } from '@/types/ThemeState';
import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { setCookie } from 'cookies-next';
import { useContext } from 'react';
export type SwitchColorblindProps = {}
const SwitchThemed = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='%23${theme.palette.mode === 'dark' ? 'FFF' : '000'}'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Ctitle%3Eaccessibility-blind%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='invisible_box' data-name='invisible box'%3E%3Crect width='48' height='48' fill='none'%3E%3C/rect%3E%3C/g%3E%3Cg id='icons_Q2' data-name='icons Q2'%3E%3Cg%3E%3Cpath d='M45.3,22.1C43.2,19.5,35.4,11,24,11a23,23,0,0,0-8.5,1.6L9.7,6.9A2,2,0,0,0,6.9,9.7L38.3,41.1a2,2,0,1,0,2.8-2.8l-4.7-4.8a32.1,32.1,0,0,0,8.9-7.6A3,3,0,0,0,45.3,22.1ZM33.4,30.6l-4-4A5.8,5.8,0,0,0,30,24a6,6,0,0,0-6-6,5.8,5.8,0,0,0-2.6.6l-2.8-2.8A19.1,19.1,0,0,1,24,15c8.8,0,15.3,6.2,17.7,9A29.7,29.7,0,0,1,33.4,30.6Z'%3E%3C/path%3E%3Cpath d='M10.4,17.6a2,2,0,0,0-2.8,2.8l15,15a2,2,0,0,0,2.8-2.8Z'%3E%3C/path%3E%3Cpath d='M5.4,22.6a1.9,1.9,0,0,0-2.8,0,1.9,1.9,0,0,0,0,2.8l7,7a2,2,0,0,0,2.8-2.8Z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#000' : '#FFF',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '80%',
      height: '80%',
      left: '10%',
      top: '10%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url("data:image/svg+xml,%3Csvg fill='%23${theme.palette.mode === 'dark' ? 'FFF' : '000'}' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath d='M23,17a1,1,0,0,1-2,0A9,9,0,0,0,3,17a1,1,0,0,1-2,0,11,11,0,0,1,22,0ZM12,10a7.008,7.008,0,0,0-7,7,1,1,0,0,0,2,0,5,5,0,0,1,10,0,1,1,0,0,0,2,0A7.009,7.009,0,0,0,12,10Zm0,4a3,3,0,0,0-3,3,1,1,0,0,0,2,0,1,1,0,0,1,2,0,1,1,0,0,0,2,0A3,3,0,0,0,12,14Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export default function StyledSwitch() {
  const themeState = useContext(ThemeContext) as ThemeState;
  return <SwitchThemed checked={themeState.colorblind} onClick={() => {
    themeState.mutate({...themeState, colorblind: !themeState.colorblind});
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 365);
    setCookie("colorblind", themeState.colorblind?"true":"false", {expires: expiryDate} );
  }}/>;
}