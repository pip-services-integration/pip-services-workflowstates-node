let crypto = require('crypto');

import { Partition } from "../data/version1/Partition";

export class PartitionHelper {
    public static getValue(key: string): string {
        if (key == null || !key.trim()) {
            return "";
        }
        return Partition.Prefix + "_" + this.getHashNumber(key);
    }

    public static getName(index: number): string {
        return Partition.Prefix + "_" + index.toString();
    }

    private static getHashNumber(key: string): string {
        // TODO: must be check correct of conversion!
         var hash = crypto.createHash('sha1').update(key).digest('hex');
         var hashVal = BigInt(hash);
         hashVal %= BigInt(Partition.Count);         
         return hashVal.toString();
    }
}

