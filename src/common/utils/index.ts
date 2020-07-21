interface UtilsInterface {
  sleep(timeLen: number): Promise<void>;
}

class Utils implements UtilsInterface {
  sleep(timeLen: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeLen);
    });
  }
}

export default new Utils();
