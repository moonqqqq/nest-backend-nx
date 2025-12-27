import { Injectable } from '@nestjs/common';
import { IUserService } from './interfaces/user-service.interface';

@Injectable()
export class UserService implements IUserService {

}
