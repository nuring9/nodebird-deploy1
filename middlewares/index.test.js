const { isLoggedIn, isNotLoggedIn } = require("./");

describe("isLoggeIn", () => {
  // 공통으로 사용하는 코드는 위로 빼서 한번만 적어서 사용.
  const res = {
    status: jest.fn(() => res), // 콜백 체인으로 인해 res를 넣어줌.
    send: jest.fn(), // 함수를 jest.fn()를 이용하여 가짜로 만들어줌.
  };
  const next = jest.fn();

  test("로그인되어 있으면 isLoggedIn이 next를 호출해야 함", () => {
    // req의 isAuthenticated는 true이기때문에 공통으로 사용하지 않아서 않에 적음.
    const req = {
      isAuthenticated: jest.fn(() => true), // if문의 isAuthenticated가 true일 때
    };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1); // 한번만 요청으로, jest의 toBeCalledTimes 사용
  });

  test("로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isLoggedIn(req, res, next);
    expect(res.status).toBeCalledWith(403);
    expect(res.send).toBeCalledWith("로그인 필요");
  });
});

describe("isNotLoggedIn", () => {
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();
  test("로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent("로그인한 상태입니다.");
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });

  test("로그인 되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
