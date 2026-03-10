import { Request, Response } from "express"
import { acceptConnectionRequestService, getUserConnectionRequestsService, getUserConnectionsService, rejectConnectionRequestService, sendConnectionRequestService } from "./connections.service";
import { SendConnectionRequestDto } from "./connections.dto";

export const getConncetionsController = async (req: Request, res: Response) => {

    const user_id = req.user.id;
    const connections = await getUserConnectionsService(user_id);
    return res.status(200).json({ connections });

}

export const getConnectionRequestsController = async (req: Request, res: Response) => {

    const user_id = req.user.id;
    const query = req.query;
    const connectionRequests = await getUserConnectionRequestsService(user_id, query);
    return res.status(200).json({ connectionRequests });
}


export const sendConnectionRequestController = async (req: Request, res: Response) => {
    const sender_id = req.user.id;
    const data:SendConnectionRequestDto = req.body;
    const connection = await sendConnectionRequestService(data, sender_id);
    return res.status(201).json({ connection });

}

export const acceptConnectionRequestController = async (req: Request, res: Response) => {

    const receiver_id = req.user.id;
    const connection_id = parseInt(req.params.connection_id as string);
    await acceptConnectionRequestService(connection_id, receiver_id);
    return res.status(200).json({ message: "Connection request accepted" });

}

export const rejectConnectionRequestController = async (req: Request, res: Response) => {

    const receiver_id = req.user.id;
    const connection_id = parseInt(req.params.connection_id as string);
    await rejectConnectionRequestService(connection_id, receiver_id);
    return res.status(200).json({ message: "Connection request rejected" });

}