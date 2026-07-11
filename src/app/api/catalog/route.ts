import { NextRequest } from "next/server";
import { listItemsController, createItemController } from "@/modules/catalog/catalog.controller";

export async function GET(req: NextRequest) {
  return listItemsController(req);
}

export async function POST(req: NextRequest) {
  return createItemController(req);
}
