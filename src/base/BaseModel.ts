import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  public set(props: Partial<this>) {
    (Object.keys(props) as Array<keyof this>).forEach((key) => {
      // @ts-expect-error
      this[key] = props[key];
    });
    return this;
  }
}
