function scrollProducts(direction) {
  const container = document.getElementById("productSlider");
  const scrollAmount = 300;

  container.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
}
