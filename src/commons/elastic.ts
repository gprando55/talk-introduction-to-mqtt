import elastic from "elasticsearch";

export const elasticClient = new elastic.Client({
  host: 'http://127.0.0.1:9200',
});