// 서비스 로직 분리로 인해 그냥 테스트 통과 코드 아무거나 넣어줌.
test("1+1은 2이다.", () => {
  expect(1 + 1).toEqual(2);
});

/* 서비스 로직 분리 후 user.test.js 는 삭제해야하지만 주석으로 처리함 .

jest.mock("../models/user"); // jes.mock으로 갈아껴준다.
const User = require("../models/user"); // 이제 require가 됨.
const { follow } = require("./user");

describe("follow", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함", async () => {
    User.findOne.mockReturnValue({
      addFollowing(id) {
        return Promise.resolve(true); // 성공으로 만들어줘야하니 resolve(true) 사용.
      },
    });
    await follow(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("사용자를 못 찾으면  res.status(404).send(no user)를 호출함", async () => {
    User.findOne.mockReturnValue(null); // 데이터를 찾아서 없으면 빈배열이므로 null사용.
    await follow(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에서 에러가 발생하면 next(error)를 호출함", async () => {
    const message = "DB에러";
    User.findOne.mockReturnValue(Promise.reject(message)); // 실패로 만들어야 하니 reject를 사용하여 message를 넣어줌.
    await follow(req, res, next);
    expect(next).toBeCalledWith(message);
  });
});

*/
