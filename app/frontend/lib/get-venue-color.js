function color(hue){
    return `hsl(${hue}, 50%, 40%)`;
}

const colors = [
    color(150),
    color(120),
    color(0),
    color(210),
    color(190),
    color(60),
    color(30),
    color(240),
    color(50),
    color(130),
    color(170)
];

export default function(index){
    index = index % colors.length;
    return colors[index];
}