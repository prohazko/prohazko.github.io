module abtn {
  export class BaseModel{

      with<T>(other: T): T;
      with(other: BaseModel):BaseModel {

          for (var key in other) {
              if (!other.hasOwnProperty(key) || key[0] == '$') continue;
              this[key] = other[key];
          }
          return this;
      }
  }
} 