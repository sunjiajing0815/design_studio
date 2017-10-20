<!doctype html>
<html>
	<head>
		<title>PHP API Demo - Filtering by Form</title>
		<style>
			.record {
				border: 2px solid orange;
				padding: 1em;
				margin-top: 1em;
			}
		</style>
	</head>
	<body>
		<?php

		// PHP errors are hidden by default, but we can turn them on
		ini_set('display_errors', 1);
		error_reporting(E_ALL ^ E_NOTICE);

		// Parse a 4 digit year from a string
		function getYear($year) {
			if($year) {
				preg_match('/[\d]{4}/', $year, $matches);
				return $matches[0];
			}
		}

		// Get submitted search text from URL

		$filter = '';
		if(isset($_GET['text']) && $_GET['text'] != '') {
			$filter = $_GET['text'];
		}

		// Concatenate an API URL including all parameters inline
		$api_url = 'http://data.gov.au/api/action/datastore_search?resource_id=f5ecd45e-7730-4517-ad29-73813c7feda8&limit=1000';

		// Cache the output from the API so we don't overload it
		// You will need to create a subfolder called "cache" and grant it 777 permissions.

		$cache_filename = 'cache/slq-cache.json';

		if(file_exists($cache_filename)) { // Cache file exists
			echo '<p>Cached: Yes</p>';
			$data = file_get_contents($cache_filename);
		}
		else { // Cache file doesn't exist, let's create one
			echo '<p>Cached: No</p>';
			$data = file_get_contents($api_url);
			file_put_contents($cache_filename, $data);
		}

		// Decode the JSON provided by the API
		$data = json_decode($data, true);
		// 'true' decodes the JSON as an array rather than an object

		// print_r outputs the array in a readable format. Remove the comment to see what it looks like
		//echo '<pre>' . print_r($data, true) . '</pre>';

		// Check if $data is an array that we can iterate over

		if(is_array($data)) {

			// Setup a blank $records variable to fill up with HTML later

			$records = '';

			// Setup a zeroed $count variable

			$count = 0;

			// Iterate over the records in the array

			foreach($data['result']['records'] as $recordKey => $recordValue) {

				//echo '<pre>' . print_r($recordValue, true) . '</pre>';

				// Specify variables for specific data

				$recordTitle = $recordValue['dc:title'];
				$recordImage = $recordValue['150_pixel_jpg'];
				$recordDescription = $recordValue['dc:description'];
				$recordYear = getYear($recordValue['dcterms:temporal']);

				if($recordTitle && $recordImage && $recordDescription && $recordYear) {

					if($filter) {
						if(strpos($recordTitle, $filter) !== FALSE) {
							$validRecord = true;
						}
						else {
							$validRecord = false;
						}
					}
					else {
						$validRecord = true;
					}

					if($validRecord) {

						// Output HTML for a record with variables included, using .= to append to the variable rather than replacing it's value

						$records .= '
						<section class="record">
							<h2>' . $recordTitle . '</h2>
							<h3>' . $recordYear . '</h3>
							<img src="' . $recordImage . '">
							<p>' . $recordDescription . '</p>
						</section>
						';

						$count++;

					}

				}

			}

		}

		?>
		<form id="filter">
			<input id="filter-text" name="text" type="text" placeholder="Filter by title" method="get" value="<?php echo $filter; ?>">
			<em>(Case-sensitive)</em>
			<p id="filter-count"><strong><?php echo $count; ?></strong> records displayed.</p>
		</form>
		<section id="records">
			<?php echo $records; ?>
		</section>
	</body>
</html>