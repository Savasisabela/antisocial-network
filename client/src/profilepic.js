export default function ProfilePic({ first, last, imageUrl, uploader }) {
    imageUrl = imageUrl || "default.png";

    const handleClick = () => {
        uploader();
    };

    return (
        <img
            onClick={handleClick}
            src={imageUrl}
            alt={`${first} ${last}`}
            className="profilepic"
        />
    );
}
