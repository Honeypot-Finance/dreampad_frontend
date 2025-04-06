import { makeAutoObservable } from "mobx";

class LbpService {
  constructor() {
    makeAutoObservable(this);
  }
}

export const lbpService = new LbpService();
