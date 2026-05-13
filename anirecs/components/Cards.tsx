export default function Cards({ title, image }: { title: string, image: string }) {
    return(
        <div className=" flex flex-col items-center mt-5 ">
            <img src={image} className="w-40 h-80 object-cover rounded-md"></img>
            <div className="text-white text-sm text-center">{title}</div>
        </div>
    )
}