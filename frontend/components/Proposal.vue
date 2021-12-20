<template>
  <div v-if="proposal" class="proposal py-4 position-relative">
    <div v-if="proposal.status" class="status pt-4">
      <span :class="statusArray[proposal.status - 1]">{{
        statusArray[proposal.status - 1].toUpperCase()
      }}</span>
    </div>
    <div class="proposal-id-title mb-3">
      <div class="proposal-id">#{{ proposal.id }}</div>
      <div class="proposal-title">
        {{
          proposal.content.value
            ? proposal.content.value.title
            : proposal.content.title
        }}
      </div>
    </div>
    <div v-if="proposer" class="row proposal-proposer">
      <div class="col-md-3 label">Proposer:</div>
      <div class="col-md-9">
        {{ proposer }}
      </div>
    </div>
    <div class="row proposal-deposit">
      <div class="col-md-3 label">Total deposit:</div>
      <div class="col-md-9">
        {{ proposal.total_deposit[0].amount }}
      </div>
    </div>
    <div class="row proposal-voting-start">
      <div class="col-md-3 label">Voting start:</div>
      <div class="col-md-9">
        {{ new Date(proposal.voting_start_time).toLocaleString() }}
      </div>
    </div>
    <div class="row proposal-voting-end">
      <div class="col-md-3 label">Voting end:</div>
      <div class="col-md-9">
        {{ new Date(proposal.voting_end_time).toLocaleString() }}
      </div>
    </div>
    <div v-if="proposal.content.type" class="row proposal-type">
      <div class="col-md-3 label">Type:</div>
      <div class="col-md-9">
        {{ proposal.content.type }}
      </div>
    </div>
    <div class="row proposal-submit-time">
      <div class="col-md-3 label">Submit time:</div>
      <div class="col-md-9">
        {{ new Date(proposal.submit_time).toLocaleString() }}
      </div>
    </div>
    <div class="row proposal-deposit-end-time">
      <div class="col-md-3 label">Deposit end time:</div>
      <div class="col-md-9">
        {{ new Date(proposal.deposit_end_time).toLocaleString() }}
      </div>
    </div>
    <div class="row proposal-details">
      <div class="col-md-3 label">Details:</div>
      <div class="col-md-9">
        <p>
          {{
            proposal.content.value
              ? proposal.content.value.description
              : proposal.content.description
          }}
        </p>
      </div>
    </div>
    <div
      v-if="
        proposal.content.type &&
        proposal.content.type.includes('SoftwareUpgradeProposal')
      "
      class="row proposal-upgrade"
    >
      <div class="col-md-3 label">Software upgrade:</div>
      <div class="col-md-9">
        <vue-json-pretty
          :data="proposal.content.value.plan"
          :show-line="false"
          :show-double-quotes="false"
        ></vue-json-pretty>
      </div>
    </div>
    <div v-if="total_votes && total_votes > 0" class="votes my-4">
      <h4>
        <span class="label-total">Total: </span
        >{{ convertPhotons(total_votes) }} PHOTONS
      </h4>
      <div class="row">
        <div class="col-md-3">
          <span class="label-votes">Yes: </span>{{ yes_votes }}% ({{
            convertPhotons(proposal.final_tally_result.yes)
          }}
          PHOTONS)
        </div>
        <div class="col-md-3">
          <span class="label-votes">No: </span>{{ no_votes }}% ({{
            convertPhotons(proposal.final_tally_result.no)
          }}
          PHOTONS)
        </div>
        <div class="col-md-3">
          <span class="label-votes">No with veto: </span>{{ no_veto_votes }}%
          ({{ convertPhotons(proposal.final_tally_result.no_with_veto) }}
          PHOTONS)
        </div>
        <div class="col-md-3">
          <span class="label-votes">Abstain: </span>{{ abstain_votes }}% ({{
            convertPhotons(proposal.final_tally_result.abstain)
          }}
          PHOTONS)
        </div>
      </div>
      <b-progress
        v-if="proposal.final_tally_result"
        class="my-2 votes-bar"
        show-value
      >
        <b-progress-bar
          v-b-tooltip.hover
          :value="yes_votes"
          variant="success"
          :title="`Yes: ${yes_votes}%`"
        ></b-progress-bar>
        <b-progress-bar
          v-b-tooltip.hover
          :title="`No: ${no_votes}%`"
          :value="no_votes"
          variant="warning"
        ></b-progress-bar>
        <b-progress-bar
          v-b-tooltip.hover
          :title="`No with veto: ${no_veto_votes}%`"
          :value="no_veto_votes"
          variant="danger"
        ></b-progress-bar>
        <b-progress-bar
          v-b-tooltip.hover
          :title="`Abstain: ${abstain_votes}%`"
          :value="abstain_votes"
          variant="info"
        ></b-progress-bar>
      </b-progress>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import axios from 'axios'

export default {
  components: {
    VueJsonPretty,
  },
  props: {
    proposal: {
      type: Object,
      default: undefined,
    },
  },
  data() {
    return {
      statusArray: ['deposit_period', 'voting_period', 'passed', 'rejected'],
      proposer: null,
      no_votes: 0,
      yes_votes: 0,
      no_veto_votes: 0,
      abstain_votes: 0,
      total_votes: 0,
      loading: false,
    }
  },
  created() {
    this.getProposer()
    this.getResults()
  },
  methods: {
    async getProposer() {
      this.loading = true

      const response = await axios
        .get(
          `${this.$config.apiEvmos}gov/proposals/${this.proposal.id}/proposer`
        )
        .catch(function (error) {
          if (error.response) {
            console.log(error.response.data)
          } else if (error.request) {
            console.log(error.request)
          } else {
            console.log('Error', error.message)
          }
        })
      if (response) {
        this.proposer = response.data.result.proposer
        this.loading = false
      }
    },

    getVotesPercentage(value) {
      return ((parseInt(value) / this.total_votes) * 100).toFixed(2)
    },
    convertPhotons(value) {
      return (value / Math.pow(10, 18)).toFixed(6)
    },
    getResults() {
      this.total_votes = Object.values(this.proposal.final_tally_result).reduce(
        (a, b) => a + parseInt(b),
        0
      )

      this.yes_votes = this.getVotesPercentage(
        this.proposal.final_tally_result.yes
      )

      this.no_votes = this.getVotesPercentage(
        this.proposal.final_tally_result.no
      )

      this.no_veto_votes = this.getVotesPercentage(
        this.proposal.final_tally_result.no_with_veto
      )

      this.abstain_votes = this.getVotesPercentage(
        this.proposal.final_tally_result.abstain
      )
    },
  },
}
</script>

<style scoped>
.proposal {
  font-family: 'Roboto-Thin', sans-serif;
  font-size: 1.2rem;
}

.proposal-id-title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.4rem;
  border-bottom: 1px solid white;
}

.label,
.label-total,
.label-votes {
  font-family: 'Roboto', sans-serif;
}

.status {
  position: absolute;
  text-align: right;
  top: 0;
  right: 0;
  font-family: 'Roboto', sans-serif;
}

@media screen and (max-width: 576px) {
  .status {
    position: static;
    text-align: left;
  }
}

.progress {
  height: 1.5rem;
}

.progress-bar {
  font-family: 'Roboto', sans-serif;
}
</style>
