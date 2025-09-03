import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import crypto from 'react-native-quick-crypto';

(global as any).Buffer = Buffer;
(global as any).crypto = crypto;
