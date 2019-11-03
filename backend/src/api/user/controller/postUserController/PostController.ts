import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IValidator } from "../../../../core/validator/IValidator";
import { TYPES } from "../../../../ioc/types";
import { SuccessResponse } from "../../../../response/SuccessResponse";
import { USER_REPOSITORIES } from "../../ioc/UserTypes";
import { IUser } from "../../model/User";
import { IUserRepository } from "../../repository/IUserRepository";
import { userPostSchema } from "../../schema/post/postUser";
import { IPostUserController } from "./IPostController";

@injectable()
export class PostUserController implements IPostUserController {

    @inject(TYPES.IValidator)
    protected readonly _validator: IValidator;

    @inject(USER_REPOSITORIES.IUserRepository)
    private readonly _userRepository: IUserRepository;

    public async process(req: Request, res: Response): Promise<Response> {
        this._validator.validate(req.body, userPostSchema);
        const user: IUser = await this._userRepository.insertOne(req.body);

        return res.json(SuccessResponse.Created(user));
    }
}
