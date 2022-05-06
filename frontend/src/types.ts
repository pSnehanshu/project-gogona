import { safeToTransmit } from '../../backend/services/user.service';

export type User = ReturnType<typeof safeToTransmit>;
