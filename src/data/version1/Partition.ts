export class Partition {
    public static Key: string = "partition_key";
    public static Prefix: string = "partition";
    public static Template: string = "{0}_{1}";
    public static Count: number = 10;
}