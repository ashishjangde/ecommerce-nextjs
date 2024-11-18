import { RequestStatus } from '@prisma/client';
import z from 'zod';

const OnboardSellerSchema = z.object({
    sellerId: z.string(),
    RequestStatus: z.nativeEnum(RequestStatus),
});

export default OnboardSellerSchema