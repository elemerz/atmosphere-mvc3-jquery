package ro.isdc.model;

public class DetailedMovieDataModel {

	private String infoSourceKey = new String();
	private String movieId = new String();
	
	public String getInfoSourceKey() {
		return infoSourceKey;
	}
	public void setInfoSourceKey(String infoSourceKey) {
		this.infoSourceKey = infoSourceKey;
	}
	public String getMovieId() {
		return movieId;
	}
	public void setMovieId(String movieId) {
		this.movieId = movieId;
	}
	
	@Override
	public String toString() {
		return "DetailedMovieDataModel [infoSourceKey=" + infoSourceKey + ", movieId=" + movieId + "]";
	}
}
