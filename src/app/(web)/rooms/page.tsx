"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { getRooms } from "@/libs/apis";
import { Room } from "@/models/room";
import Search from "@/components/Search/Search";
import RoomsCard from "@/components/RoomsCard/RoomsCard";

const Rooms = () => {
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [searchQyery, setSearchQyery] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("searchQuery");
    const roomType = searchParams.get("roomType");
    if (roomType) {
      setRoomTypeFilter(roomType);
    }
    if (searchQuery) {
      setSearchQyery(searchQuery);
    }
  }, []);

  async function fetchData() {
    return getRooms();
  }

  const { data, error, isLoading } = useSWR("get/hotelRooms", fetchData);

  if (error) throw new Error("No se ha podido cargar los datos");
  if (typeof data === "undefined" && !isLoading)
    throw new Error("No se ha podido cargar los datos");

  const filterRooms = (rooms: Room[]) => {
    return rooms.filter((room) => {
      // Aplica filtro por roomTYpe
      if (
        roomTypeFilter &&
        roomTypeFilter.toLowerCase() !== "all" &&
        room.type.toLowerCase() !== roomTypeFilter.toLowerCase()
      ) {
        return false;
      }
      // Aplica filtro por searchQuery
      if (
        searchQyery &&
        !room.name.toLowerCase().includes(searchQyery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  };

  const filteredRooms = filterRooms(data || []);

  return (
    <div className="container mx-auto pt-10">
      <Search
        roomTypeFilter={roomTypeFilter}
        searchQuery={searchQyery}
        setRoomTypeFilter={setRoomTypeFilter}
        setSearchQuery={setSearchQyery}
      />
      <div className={!isFiltered ? "flex mt-20 gap-1 flex-wrap":"flex mt-20 justify-between flex-wrap"}>
        {filteredRooms.map((room) => (
          <RoomsCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;
