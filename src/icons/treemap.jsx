import React from 'react';

let Chart = ({color}) =>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125" x="0px" y="0px" style={{ width: '50px', height: '50px' }} >
        <title>chart</title>
        <path stroke={color} fill={color} d="M92,5H8A3,3,0,0,0,5,8V92a3,3,0,0,0,3,3H92a3,3,0,0,0,3-3V8A3,3,0,0,0,92,5Zm.33,3V26.84h-41V7.64H92A.33.33,0,0,1,92.36,8ZM70.52,92.36H51.32V29.75h19.2V92.36Zm2.64-62.88h19.2V70.83H73.16ZM8,7.64H48.68v41h-41V8A.33.33,0,0,1,8,7.64ZM7.64,92V51.32h41v41H8A.33.33,0,0,1,7.64,92Zm84.4.33H73.16V73.47h19.2V92A.33.33,0,0,1,92,92.36Z" />
    </svg>

export default Chart