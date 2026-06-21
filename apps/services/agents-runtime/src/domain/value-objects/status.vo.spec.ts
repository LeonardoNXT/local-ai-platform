import StatusVo from "./status.vo.ts";

describe("[ STATUS - VALUE OBJECT ]", () => {
  it("[CREATE] it must returns a valid value object of status", () => {
    const status = StatusVo.create("pending");
    expect(status).toBeInstanceOf(StatusVo);
  });
  it("[GET STRING] it must returns a valid status string", () => {
    const status = StatusVo.create("pending").getValue();
    expect(status).toBe("pending");
  });
});
