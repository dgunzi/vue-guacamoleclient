let RecentConnection = function RecentConnection(name, entry) {
    /**
     * The human-readable name of this connection.
     *
     * @type String
     */
    this.name = name;

    /**
     * The history entry associated with this recent connection.
     *
     * @type HistoryEntry
     */
    this.entry = entry;
};

export default RecentConnection;
