if (loading) return <Spinner />;

if (!user) {
  router.push("/login");
  return null;
}

return children;