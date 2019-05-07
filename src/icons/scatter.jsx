import React from 'react';

let Chart = ({color}) =>
<svg xmlns="http://www.w3.org/2000/svg" style={{ width: '50px', height: '50px' }} 
    xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="7.5 7.5 50 62.5" enableBackground="new 7.5 7.5 50 50" xmlSpace="preserve">
    <path stroke={color} d="M56.505,51.083H8.995V13.417c0-0.276-0.224-0.5-0.5-0.5s-0.5,0.224-0.5,0.5v38.166c0,0.276,0.224,0.5,0.5,0.5h48.01  c0.276,0,0.5-0.224,0.5-0.5S56.781,51.083,56.505,51.083z"/>
    <circle stroke={color} fill={color} cx="14.917" cy="41.834" r="3.167"/>
    <path stroke={color} fill={color} d="M24.333,41.668c3.17,0,5.75-2.579,5.75-5.75s-2.58-5.75-5.75-5.75s-5.75,2.58-5.75,5.75S21.163,41.668,24.333,41.668z"/>
    <path stroke={color} fill={color} d="M35.167,38.502c1.608,0,2.917-1.309,2.917-2.918c0-1.607-1.309-2.916-2.917-2.916s-2.917,1.309-2.917,2.916  C32.25,37.193,33.559,38.502,35.167,38.502z"/>
    <circle stroke={color} fill={color} cx="24.167" cy="45.251" r="2.083"/>
    <circle stroke={color} fill={color} cx="29.083" cy="24.167" r="2.667"/>
    <path stroke={color} fill={color} d="M37.167,31.917c1.884,0,3.417-1.533,3.417-3.417s-1.533-3.417-3.417-3.417S33.75,26.616,33.75,28.5  S35.283,31.917,37.167,31.917z"/>
    <path stroke={color} fill={color} d="M37.75,23.167c2.206,0,4-1.794,4-4s-1.794-4-4-4s-4,1.794-4,4S35.544,23.167,37.75,23.167z"/>
    <path stroke={color} fill={color} d="M46.5,29c1.884,0,3.417-1.533,3.417-3.417s-1.533-3.417-3.417-3.417s-3.416,1.533-3.416,3.417S44.616,29,46.5,29z"/>
    <path stroke={color} fill={color} d="M44.5,37.168c2.067,0,3.75-1.683,3.75-3.75c0-2.068-1.683-3.75-3.75-3.75s-3.75,1.683-3.75,3.75  C40.75,35.485,42.433,37.168,44.5,37.168z"/>
</svg>

export default Chart;