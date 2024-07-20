"use client";

import useSWR from "swr";
import { MdOutlineCleaningServices } from "react-icons/md";
import { LiaFireExtinguisherSolid } from "react-icons/lia";
import { useState } from "react";
import { GiSmokeBomb } from "react-icons/gi";
import { AiOutlineMedicineBox } from "react-icons/ai";
import axios from "axios";

import { getRoom } from "@/libs/apis";
import LoadingSpinner from "../../loading";
import HotelPhotoGallery from "@/components/HotelPhotoGallery/HotelPhotoGallery";
import BookRoomCta from "@/components/BookRoomCta/BookRoomCta";
import toast from "react-hot-toast";
import { getStripe } from "@/libs/stripe";
import RoomReview from "@/components/RoomReview/RoomReview";

const RoomDetails = (props: { params: { slug: string } }) => {
  const {
    params: { slug },
  } = props;

  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1)
  const [numberOfchildren, setNumberOfChildren] = useState(0)
  const fetchRoom = async () => getRoom(slug);

  const { data: room, error, isLoading } = useSWR("/api/room", fetchRoom);
  if (error) throw new Error("No se ha podido cargar los datos");
  if (typeof room === "undefined" && !isLoading)
    throw new Error("No se ha podido cargar los datos");
  if (!room) return <LoadingSpinner />;

  const calcMinCkeckoutDate = () => {
    if (checkinDate) {
      const nextDay = new Date(checkinDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
    return undefined
  };

  const handleBookNowClick = async () => {
    if (!checkinDate || !checkoutDate) return toast.error("Por favor seleccione las fechas");
    if(checkinDate > checkoutDate) return toast.error("La fecha de check-in no puede ser posterior a la fecha de check-out");
    const numberOfDays = calcNumDays()
    const hotelRoomSlug = room.slug.current
    const stripe = await getStripe()

    try {
      const { data: stripeSession} = await axios.post('/api/stripe', {
        checkinDate,
        checkoutDate,
        adults,
        children: numberOfchildren,
        numberOfDays,
        hotelRoomSlug
      })

      if(stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: stripeSession.id
        })

        if(result.error) {
          toast.error("Ha fallado el pago. Por favor intentelo de nuevo")
        }
      }
    } catch (error) {
       console.log("Error: ", error)
       toast.error("Ha ocurrido un error. Por favor intentelo de nuevo")
    }
    
  }

  const calcNumDays = () => {
    if (!checkinDate || !checkoutDate) return;
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    const noDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return noDays;
  };

  return (
    <div>
      <HotelPhotoGallery photos={room.images} />

      <div className="container mx-auto mt-10">
        <div className="md:grid md:grid-cols-12 gap-10 px-3">
          <div className="col-span-8 w-full">
            <div>
              <h2 className="font-bold text-left text-lg md:text-2xl">
                {room.name} ({room.dimension})
              </h2>
              <div className="flex flex-wrap my-11">
                {room.offeredAmenities.map((amenity) => (
                  <div
                    key={amenity._key}
                    className="w-28 md:w-44 text-center px-2 md:px-0 h-20 md:h-40 mr-3 bg-[#eff0f2] dark:bg-gray-800 rounded-lg grid place-content-center"
                  >
                    <i className={`fa-solid ${amenity.icon} md:text-2xl`}></i>
                    <p className="text-xs md:text-base pt-3">
                      {amenity.amenity}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mb-11">
                <h2 className="font-bold text-3xl mb-2">Descripción</h2>
                <p>{room.description}</p>
              </div>
              <div className="mb-11">
                <h2 className="font-bold text-3xl mb-2">Servicios ofrecidos</h2>
                <div className="grid grid-cols-2">
                  {room.offeredAmenities.map((amenity) => (
                    <div
                      key={amenity._key}
                      className="flex items-center gap-x-2 md:my-0 my-1"
                    >
                      <i className={`fa-solid ${amenity.icon} `}></i>
                      <p className="text-xs md:text-base">{amenity.amenity}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-11">
                <h2 className="font-bold text-3xl mb-2">Seguridad e Higiene</h2>
                <div className="grid grid-cols-2">
                  <div className="flex items-center my-1 md:my-0">
                    <MdOutlineCleaningServices />
                    <p className="text-xs md:text-base ml-2">Limpieza diaria</p>
                  </div>
                  <div className="flex items-center my-1 md:my-0">
                    <LiaFireExtinguisherSolid />
                    <p className="text-xs md:text-base ml-2">Extintor</p>
                  </div>
                  <div className="flex items-center my-1 md:my-0">
                    <AiOutlineMedicineBox />
                    <p className="text-xs md:text-base ml-2">
                      Desinfecciones y esterealizaciones
                    </p>
                  </div>
                  <div className="flex items-center my-1 md:my-0">
                    <GiSmokeBomb />
                    <p className="text-xs md:text-base ml-2">
                      Detector de humos
                    </p>
                  </div>
                </div>
              </div>
              <div className="shadow md:shadow-white rounded-lg p-6">
                <div className="items-center mb-4">
                  <p className="md:text-lg  font-semibold">
                    Opiniones de los clientes
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RoomReview roomId={room._id}/>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 rounded-xl shadow-lg dark:shadow dark:shadow-white sticky top-10 h-fit overflow-auto mt-10 md:mt-0">
            <BookRoomCta
              discount={room.discount}
              price={room.price}
              specialNote={room.specialNote}
              checkinDate={checkinDate}
              setCheckinDate={setCheckinDate}
              checkoutDate={checkoutDate}
              setCheckoutDate={setCheckoutDate}
              calcMinCkeckoutDate={calcMinCkeckoutDate}
              adults={adults}
              numberOfChildren={numberOfchildren}
              setAdults={setAdults}
              setNumberOfChildren={setNumberOfChildren}
              isBooked={room.isBooked}
              handleBookNowClick={handleBookNowClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
