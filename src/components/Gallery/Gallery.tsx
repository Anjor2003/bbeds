import Image from "next/image"

const Gallery = () => {
  return (
    <div className="mx-auto container py-14 h-full">
      <div className="flex flex-wrap px-4 sm:px-0 md:-m-2">
        <div className="w-1/2 flex flex-wrap">
          <div className="w-1/2 p-1 md:p-2 h-52">
            <Image
              alt="gallery"
              className="img"
              src="/images/Hero_1.jpeg"
              width={200}
              height={400}
            />
          </div>
          <div className="w-1/2 p-1 md:p-2 h-52">
            <Image
              alt="gallery"
              className="img"
              src="/images/Hero_2.jpg"
              width={200}
              height={400}
            />
          </div>
          <div className="w-full xl:w-1/2 p-1 md:p-2 h-52">
            <Image
              alt="gallery"
              className="img "
              src="/images/Hero_3.jpg"
              width={200}
              height={400}
            />
          </div>
        </div>
        <div className="w-1/2 flex flex-wrap">
          <div className="w-full p-1 md:p-2 h-52">
            <Image
              alt="gallery"
              className="img"
              src="/images/Hero_3.jpg"
              width={200}
              height={400}
            />
          </div>
          <div className="w-1/2 p-1 md:p-2 h-52">
            <Image
              alt="gallery"
              className="img"
              src="/images/Hero_2.jpg"
              width={200}
              height={400}
            />
          </div>
          <div className="w-1/2 p-1 md:p-2 h-52 ">
            <Image
              alt="gallery"
              className="img "
              src="/images/Hero_1.jpeg"
              width={200}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery