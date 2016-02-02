
export default function AvatarPreview(props){
    return <img style={{
            width: 150,
            border: "2px solid black"
        }} src={props.src} />
}