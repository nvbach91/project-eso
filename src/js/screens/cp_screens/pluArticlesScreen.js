App.renderPluArticlesScreen = () => {
    const screen = $(`
    <div class="card no-bounds-card">
        <h5 class="card-header">Manage your catalog
            <button class="btn btn-primary">Import/Export</button>
        </h5>
        <div class="card-body">
            <p class="card-text">Number of articles you have is currently 0</p>

        <div class="input-group">
            <input value="" class="form-control" placeholder="Search by name or code" title="PLU EAN code 1-20 digits" id="plu-searcher">
            <button class="btn btn-primary group-button">SEARCH</button>
        </div>
    </div>
  `);
  App.jCPBody.replaceWith(screen);
  App.jCPBody = screen;
}