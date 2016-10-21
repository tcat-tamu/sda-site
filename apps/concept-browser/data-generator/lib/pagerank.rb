MAX_ITER = 1000
EPSILON = 1e-15

def pagerank(adj_list, d = 0.85)
  n = adj_list.size
  nodes = adj_list.keys
  incident_list = Hash.new { |h, k| h[k] = [] }
  out_degree = Hash.new { |h, k| h[k] = 0 }

  adj_list.each do |src, adj|
    out_degree[src] = adj.size
    adj.each { |dst| incident_list[dst] << src }
  end

  damping_term = (1.0 - d) / n

  curr = {}
  prev = {}
  nodes.each { |p| prev[p] = 1.0 / n }

  converged = false
  num_iter = 0

  while !converged && num_iter < MAX_ITER
    converged = true
    num_iter += 1

    nodes.each do |p|
      sum = incident_list[p].map { |q| prev[q] / out_degree[q] }.inject(0, :+)
      curr[p] = damping_term + d * sum
      converged = false if (curr[p] - prev[p]).abs > EPSILON
    end

    prev.merge! curr
  end

  sum = prev.values.inject(:+)
  prev.each { |p, x| prev[p] = x / sum }
end
