import { CreateBookingDto, Room } from "@/models/room";
import axios from "axios";

import sanityClient from "./sanity";
import * as queries from "./sanityQueries";
import { Booking } from "@/models/booking";
import { createReviewDto, Review, updateReviewDto } from "@/models/review";

export async function getFeaturedRoom() {
  const result = await sanityClient.fetch<Room>(queries.getFeaturedRoomQuery, {}, {
    cache: "no-cache"
  })
  return result
}

export async function getRooms() {
  const result = await sanityClient.fetch<Room[]>(queries.getRoomsQuery, {}, {
    cache: "no-cache"
  })
  return result
}

export async function getRoom(slug: string) {
  const result = await sanityClient.fetch<Room>(queries.getRoom, {
    slug
  }, {
    cache: "no-cache"
  })
  return result
}

export const createBooking = async ({ adults, children, checkinDate, checkoutDate, discount, hotelRoom, numberOfDays, totalPrice, user }: CreateBookingDto) => {
  const mutation = {
    mutations: [
      {
        create: {
          _type: "booking",
          user: {
            _type: "reference",
            _ref: user
          },
          hotelRoom: {
            _type: "reference",
            _ref: hotelRoom
          },
          checkinDate,
          checkoutDate,
          numberOfDays,
          adults,
          children,
          totalPrice,
          discount
        },
      },
    ],
  }
  const { data } = await axios.post(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2022-03-25/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`, mutation, {
    headers: {
      Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}`
    }
  })
  return data
}

export const updatedHotelRoom = async (hotelRoomId: string) => {
  const mutation = {
    mutations: [
      {
        patch: {
          id: hotelRoomId,
          set: {
            isBooked: true,
          },
        },
      },
    ],
  }

  const { data } = await axios.post(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2022-03-25/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`, mutation, {
    headers: {
      Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}`
    }
  })
  return data
}

export async function getUserBookings(userId: string) {
  const result = await sanityClient.fetch<Booking[]>(queries.getUserBookingsQuery, { userId }, {
    cache: "no-cache"
  })
  return result
}

export async function getuserData(userId: string) {
  const result = await sanityClient.fetch(queries.getUserDataQuery, { userId }, {
    cache: "no-cache"
  }
  )
  return result
}

export async function checkReviewExists(userId: string, hotelRoomId: string): Promise<null | { _id: string }> {
  const query = `
  *[_type == "review" && user._ref == $userId && hotelRoom._ref == $hotelRoomId][0] {
    _id
  }
  `
  const params = {
    userId,
    hotelRoomId
  }
  const result = await sanityClient.fetch(query, params)
  return result ? result : null
}

export const updateReview = async ({ reviewId, reviewText, userRating }: updateReviewDto) => {
  const mutation = {
    mutations: [
      {
        patch: {
          id: reviewId,
          set: {
            text: reviewText,
            userRating
          },
        },
      },
    ],
  }
  const { data } = await axios.post(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2022-03-25/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`, mutation, {
    headers: {
      Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}`
    }
  })
  return data
}

export const createReview = async ({ userId, hotelRoomId, reviewText, userRating }: createReviewDto) => {
  const mutation = {
    mutations: [
      {
        create: {
          _type: "review",
          user: {
            _type: "reference",
            _ref: userId
          },
          hotelRoom: {
            _type: "reference",
            _ref: hotelRoomId
          },
          userRating,
          text: reviewText,
        },
      },
    ],
  }
  const { data } = await axios.post(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2022-03-25/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`, mutation, {
    headers: {
      Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}`
    }
  })
  return data
}

export async function getRoomReviews(roomId: string) {
  const result = await sanityClient.fetch<Review[]>(queries.getRoomReviewsQuery, { roomId }, {
    cache: "no-cache"
  })
  return result
}