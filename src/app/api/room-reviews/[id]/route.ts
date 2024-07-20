import { getRoomReviews } from "@/libs/apis";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const roomId = params.id

  try {
    const roomReviews = await getRoomReviews(roomId)

     return new NextResponse(JSON.stringify(roomReviews), { status: 200 });
  } catch (error) {
    console.log("Ha fallado la carga de las reseñas",error);
    return new NextResponse("Imposible cargar las reseñas", { status: 400 });
  }
}