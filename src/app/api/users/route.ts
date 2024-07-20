import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/libs/auth";
import { checkReviewExists, createReview, getuserData, updateReview } from "@/libs/apis";


export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new NextResponse('Autentificacion requerida', { status: 500 })
  }

  const userId = session.user.id
  try {
    const data = await getuserData(userId)
    return NextResponse.json(data, { status: 200, statusText: "Perfecto" })
  } catch (error) {
    return new NextResponse('No se ha podido capturar datos', { status: 400 })
  }
}
export async function POST(req: Request, res: Response) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse('Autentificacion requerida', { status: 500 })
  }
  const { roomId, reviewText, ratingValue } = await req.json()

  if (!roomId || !reviewText || !ratingValue) {
    return new NextResponse('Todos los campos son requeridos', { status: 400 })
  }

  const userId = session.user.id

  try {
    // chequear si ya existe una review
    const alreadyExists = await checkReviewExists(userId, roomId)

    let data;
    if (alreadyExists) {
      // actualizar review
      data = await updateReview({ reviewId: alreadyExists._id, reviewText, userRating: ratingValue })
    } else {
      // crear review
      data = await createReview({ hotelRoomId: roomId, reviewText, userRating: ratingValue, userId })
    }

    return NextResponse.json(data, { status: 200, statusText: "Perfecto" })

  } catch (error: any) {
    console.log("error al crear review", error);
    return new NextResponse('No se ha podido crear el review', { status: 400 })

  }
}