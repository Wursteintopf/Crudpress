/**
 * BaseModel Entity to be saved with TypeORM. All Models should extend this BaseModel.
 * Provides a numerical id as primary generated column and a set function to set all values of a model.
 */
export declare class BaseModel {
    id: number;
    /**
     * Helper function to set all values of a model
     * @param props A partial containing all values to be updated
     * @returns The updated object
     */
    set(props: Partial<this>): this;
}
