import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { randomIntFromInterval, randomNumbers } from "@/libs/utils";
import ThemeProvider from "./Theme";
import ContactProvider, { type ContactFormInput, useContact } from "./Contact";

/** ============================ MOCKS ============================ */

jest.mock("@apollo/client", () => ({
  ApolloClient: () => {
    return { query: async () => ({ data: { contact: [] } }) };
  },
  InMemoryCache: jest.fn(),
  useLazyQuery: () => {
    let loading = false;

    const handler = async ({ variables: { ...variables } }) => {
      let contact = dummyData(10);
      if (variables.search) {
        contact = contact.filter((c) =>
          [c.first_name, c.last_name].includes(variables.search)
        );
      }

      return {
        data: {
          contact,
        },
      };
    };

    return [handler, { loading }];
  },
  useMutation: () => {
    let loading = false;

    const handler = async ({ variables: { ...variables } }) => {
      return {
        data: {
          insert_contact_one: variables.contact,
          update_contact_by_pk: variables.contact,
          delete_contact_by_pk: variables.contact,

          delete_contact: { returning: [] },
          insert_phone: { returning: [] },
          update_phone: { returning: [] },
          delete_phone: { returning: [] },
        },
      };
    };

    return [handler, { loading }];
  },
  gql: jest.fn(),
}));

/** ============================ HELPERS ============================ */

function dummyData(count: number): ContactFormInput[] {
  return Array(count)
    .fill({})
    .map((_, i) => {
      const contactId = randomIntFromInterval(100, 200);
      return {
        id: contactId,
        first_name: "demo" + i,
        last_name: "",
        phones: Array(randomIntFromInterval(1, 10))
          .fill({})
          .map((_, j) => ({
            id: randomIntFromInterval(100, 200),
            contact_id: contactId,
            number: randomNumbers(randomIntFromInterval(8, 12)),
          })),
        isFavorite: i % 3 === 0,
      };
    });
}

function setTimeoutPromise(timeout: number) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

/** ============================ UNIT TEST: QUERIES ============================ */

describe("Fetching the data", () => {
  it('Should split data into 2 "Regular list" and "Favorite list"', async () => {
    const TestComponent = () => {
      const { list, favList } = useContact();

      return (
        <div>
          {list.length > 0 && (
            <div data-testid="regular-list">
              {list.map((c, i) => (
                <button key={i}>{c.first_name}</button>
              ))}
            </div>
          )}

          {favList.length > 0 && (
            <div data-testid="favorite-list">
              {favList.map((c, i) => (
                <button key={i}>{c.first_name}</button>
              ))}
            </div>
          )}
        </div>
      );
    };

    render(
      <ThemeProvider>
        <ContactProvider>
          <TestComponent />
        </ContactProvider>
      </ThemeProvider>
    );

    await setTimeoutPromise(1000);
    await waitFor(() => {
      const regularList = screen.getByTestId("regular-list");
      const favoriteList = screen.getByTestId("favorite-list");
      expect(regularList).toBeInTheDocument();
      expect(favoriteList).toBeInTheDocument();
    });
  });

  it("Should fetch more data (Pagination) on scrolling to bottom", async () => {
    const TestComponent = () => {
      const { list } = useContact();

      return (
        <div
          style={{ height: "100vh", overflowY: "scroll", position: "relative" }}
          id="main"
          data-testid="main"
        >
          {list.length > 0 && (
            <div style={{ height: "100%" }}>
              {list.map((c, i) => (
                <button key={i}>{c.first_name}</button>
              ))}
            </div>
          )}
          <p data-testid="count">{list.length}</p>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <ContactProvider>
          <TestComponent />
        </ContactProvider>
      </ThemeProvider>
    );

    await setTimeoutPromise(1000);
    const mainContainer = screen.getByTestId("main");

    const countBeforeScroll = await waitFor(() => {
      const regularListCount = screen.getByTestId("count");
      return regularListCount.innerHTML;
    });

    const scrolled = fireEvent.scroll(mainContainer, {
      target: {
        scrollTop: mainContainer.scrollHeight - mainContainer.offsetHeight,
      },
    });

    if (scrolled) {
      await setTimeoutPromise(1000);
      const countAfterScroll = await waitFor(() => {
        const regularListCount = screen.getByTestId("count");
        return regularListCount.innerHTML;
      });

      expect(countBeforeScroll).not.toEqual(countAfterScroll);
    }
  });

  it("Should fetch search results on searching data", async () => {
    const TestComponent = () => {
      const { searchResult, handleSearch } = useContact();

      return (
        <div>
          <input
            data-testid="search-input"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResult.length > 0 && (
            <div data-testid="search-result">
              {searchResult.map((c, i) => (
                <button data-testid={`search-result-${i}`} key={i}>
                  {c.first_name}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    };

    render(
      <ThemeProvider>
        <ContactProvider>
          <TestComponent />
        </ContactProvider>
      </ThemeProvider>
    );

    await setTimeoutPromise(1000);
    const searchInput = screen.getByTestId("search-input");
    let searchValue = "demo1";
    const typedDemo1 = fireEvent.change(searchInput, {
      target: { value: searchValue },
    });

    if (typedDemo1) {
      await setTimeoutPromise(1000);
      await waitFor(() => {
        const searchResult = screen.getByTestId("search-result");
        expect(searchResult).toBeInTheDocument();
        const searchResultItem = screen.getByTestId("search-result-0");
        const searchResultItemHTML = searchResultItem.innerHTML;
        expect(searchResultItemHTML).toEqual(searchValue);
      });
    }

    searchValue = "demo2";
    const typedDemo2 = fireEvent.change(searchInput, {
      target: { value: searchValue },
    });
    if (typedDemo2) {
      await setTimeoutPromise(1000);
      await waitFor(() => {
        const searchResult = screen.getByTestId("search-result");
        expect(searchResult).toBeInTheDocument();
        const searchResultItem = screen.getByTestId("search-result-0");
        const searchResultItemHTML = searchResultItem.innerHTML;
        expect(searchResultItemHTML).toEqual(searchValue);
      });
    }
  });
});

/** ============================ UNIT TEST: MUTATIONS ============================ */

describe("Mutate the data", () => {
  it("Should insert new data", async () => {
    const TestComponent = () => {
      const { list, handleInsertContact } = useContact();

      return (
        <div>
          {list.length > 0 && (
            <div>
              {list.map((c, i) => (
                <button key={i}>{c.first_name}</button>
              ))}
            </div>
          )}
          <button
            onClick={async () =>
              handleInsertContact({
                id: randomIntFromInterval(100, 200),
                first_name: "Added",
                last_name: "",
                phones: [{ number: "1234567890" }],
              })
            }
            data-testid="add-item"
          >
            Add
          </button>
          <p data-testid="count">{list.length}</p>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <ContactProvider>
          <TestComponent />
        </ContactProvider>
      </ThemeProvider>
    );

    await setTimeoutPromise(1000);
    const oldCount = await waitFor(() => {
      const count = screen.getByTestId("count");
      return count.innerHTML;
    });

    const addButton = screen.getByTestId("add-item");
    const clicked = fireEvent.click(addButton);

    if (clicked) {
      await setTimeoutPromise(1000);
      const newCount = await waitFor(() => {
        const count = screen.getByTestId("count");
        return count.innerHTML;
      });

      expect(Number(oldCount)).toBeLessThan(Number(newCount));
    }
  });

  it("Should update data", async () => {
    const TestComponent = () => {
      const { list, handleUpdateContact } = useContact();

      return (
        <div>
          {list.length > 0 && (
            <div data-testid="regular-list">
              {list.map((c, i) => (
                <button data-testid={`regular-list-${i}`} key={i}>
                  {c.first_name}
                </button>
              ))}
            </div>
          )}
          {list.length > 0 && (
            <button
              onClick={async () =>
                handleUpdateContact(list[0].id, {
                  ...list[0],
                  first_name: "An Item",
                })
              }
              data-testid="update-item"
            >
              Update
            </button>
          )}
        </div>
      );
    };

    render(
      <ThemeProvider>
        <ContactProvider>
          <TestComponent />
        </ContactProvider>
      </ThemeProvider>
    );

    await setTimeoutPromise(1000);
    const oldItem = await waitFor(() => {
      const regularList = screen.getByTestId("regular-list");
      expect(regularList).toBeInTheDocument();
      const item = screen.getByTestId("regular-list-0");
      return item.innerHTML;
    });

    const updateButton = screen.getByTestId("update-item");
    const clicked = fireEvent.click(updateButton);

    if (clicked) {
      await setTimeoutPromise(1000);
      const newItem = await waitFor(() => {
        const item = screen.getByTestId("regular-list-0");
        return item.innerHTML;
      });

      expect(oldItem).not.toEqual(newItem);
    }
  });

  it("Should delete data", async () => {
    const TestComponent = () => {
      const { list, handleDeleteContact } = useContact();

      return (
        <div>
          {list.length > 0 && (
            <div>
              {list.map((c, i) => (
                <button key={i}>{c.first_name}</button>
              ))}
            </div>
          )}
          {list.length > 0 && (
            <button
              onClick={async () => handleDeleteContact(list[0].id)}
              data-testid="delete-item"
            >
              Delete
            </button>
          )}
          <p data-testid="count">{list.length}</p>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <ContactProvider>
          <TestComponent />
        </ContactProvider>
      </ThemeProvider>
    );

    await setTimeoutPromise(1000);
    const oldCount = await waitFor(() => {
      const count = screen.getByTestId("count");
      return count.innerHTML;
    });

    const deleteButton = screen.getByTestId("delete-item");
    const clicked = fireEvent.click(deleteButton);

    if (clicked) {
      await setTimeoutPromise(1000);
      const newCount = await waitFor(() => {
        const count = screen.getByTestId("count");
        return count.innerHTML;
      });

      expect(Number(oldCount)).toBeGreaterThan(Number(newCount));
    }
  });
});

/** ============================ UNIT TEST: FAVORITE LIST ============================ */

describe("Favorite list feature", () => {
  it("Should able to toggle certain item from regular to favorite", async () => {
    const TestComponent = () => {
      const { list, favList, toggleFavorite } = useContact();

      return (
        <div>
          {list.length > 0 && (
            <div data-testid="regular-list">
              {list.map((c, i) => (
                <button
                  key={i}
                  data-testid={`regular-list-${i}`}
                  onClick={() => toggleFavorite(c.id)}
                >
                  {c.first_name}
                </button>
              ))}
            </div>
          )}

          {favList.length > 0 && (
            <div data-testid="favorite-list">
              {favList.map((c, i) => (
                <button key={i} data-testid={`favorite-list-${i}`}>
                  {c.first_name}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    };

    render(
      <ThemeProvider>
        <ContactProvider>
          <TestComponent />
        </ContactProvider>
      </ThemeProvider>
    );

    await setTimeoutPromise(1000);
    const { regularList, favoriteList, regularListItem, regularItemHTML } =
      await waitFor(() => {
        const regularListItem = screen.getByTestId("regular-list-0");
        const regularList = screen.getByTestId("regular-list");
        const favoriteList = screen.getByTestId("favorite-list");
        const regularItemHTML = regularListItem.innerHTML;
        expect(regularList).toContainHTML(regularItemHTML);
        expect(favoriteList).not.toContainHTML(regularItemHTML);
        return { regularList, favoriteList, regularListItem, regularItemHTML };
      });

    const clicked = fireEvent.click(regularListItem);
    if (clicked) {
      await setTimeoutPromise(1000);
      await waitFor(() => {
        expect(regularList).not.toContainHTML(regularItemHTML);
        expect(favoriteList).toContainHTML(regularItemHTML);
      });
    }
  });
});
