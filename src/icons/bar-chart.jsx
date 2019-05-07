
import React from 'react';

let Chart = ({color}) => {
    return <svg viewBox="0 0 512 512" style={{ width: '50px', height: '50px' }} stroke={color} fill={color} xmlns="http://www.w3.org/2000/svg"><path d="m497 482h-46v-347c0-8.289062-6.710938-15-15-15h-90c-8.289062 0-15 6.710938-15 15v347h-30v-467c0-8.289062-6.710938-15-15-15h-90c-8.289062 0-15 6.710938-15 15v467h-30v-227c0-8.289062-6.710938-15-15-15h-91c-8.289062 0-15 6.710938-15 15v227h-15c-8.289062 0-15 6.710938-15 15s6.710938 15 15 15h482c8.289062 0 15-6.710938 15-15s-6.710938-15-15-15zm0 0" /></svg>
}

export default Chart;