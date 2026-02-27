// Removed better-auth related code. Implement new auth logic here as needed.
      });
      const session = await res.json();
      if (!session.data) {
        return { data: null, error: { message: "No session found" } };
      }
      return {
        data: session,
        error: null,
      };
    } catch (error) {
      console.error(error);
      return {
        data: null,
        error: {
          message: "Something went wrong",
        },
      };
    }
  },
};
