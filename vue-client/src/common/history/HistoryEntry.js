let HistoryEntry = function HistoryEntry(id, thumbnail) {
    /**
     * The ID of the connection associated with this history entry,
     * including type prefix.
     */
    this.id = id;

    /**
     * The thumbnail associated with the connection associated with this
     * history entry.
     */
    this.thumbnail = thumbnail;
};

export default HistoryEntry;
